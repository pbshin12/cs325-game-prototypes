using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerAttack : MonoBehaviour
{
    public Transform firePoint;
    public GameObject projectilePrefab;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    /* Allows the player to shoot */
    public void shoot()
    {
        Debug.Log("Player shooting");
        Instantiate(projectilePrefab, firePoint.position, firePoint.rotation);

    }
}
